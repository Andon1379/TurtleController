turtle = turtle
http = http
os = os
settings = settings
local function loaddeps()
  loaddep1 = require("myFun")
  if loaddep1 == nil or loaddep1 == false then
    error("My fun did not load", 1)
    return 1
  end
  return 0
end

Url = ""
--os.setComputerLabel("")
t_id = os.getComputerID()
SG_id = nil -- server given id

function Eval_cmd(command)
  local a = "return " .. command
  local func, err = load(a)
  if func then
    local ok, add, errStr = pcall(func)
    -- ok is if it is an accepted function
    -- add is if it was run correctly
    -- errStr is the returned str if add is false
    if ok then
      --- additional code to run when func is run
      --print(ok, add, errStr)
      return add, errStr
    else
      --print("exec error: ", add)
      return "exec error: " .. add
    end
  else
    --print("compilation error: ", err)
    return "compilation error: " .. err
  end
end

function make_packet(message)
  --- derfine vars
  local name = os.getComputerLabel()
  local fuelLevel = turtle.getFuelLevel()
  local fuelLimit = turtle.getFuelLimit()
  --- inventory
  local inventory = {}
  inventory.selectedSlot = turtle.getSelectedSlot() - 1
  inventory.slots = {}
  for i = 16,1,-1 do --- max,min,increment
    if type(turtle.getItemDetail(i)) ~= "nil" then
      local item = turtle.getItemDetail(i)
      --print(textutils.serializeJSON(item))
      --i_str = tostring(i)
      table.insert(inventory.slots, i, item)
    else
      local slot = {}
      slot.name = ""
      slot.count = 0
      --inventory.slots[i] = item
      table.insert(inventory.slots, i, slot)
    end
  end
  --print(myFun.ObjToJSON(inventory.slots))
  local fuel = {fuelLevel = fuelLevel, fuelLimit = fuelLimit}
  --- rest of needed
  --- make new obj, with a obj in it. this new obj should include the blocks above, below, and in front of.
  local blocks = { up={}, front={}, down={} }
  blocks.up.sucess, blocks.up.data = turtle.inspectUp()
  blocks.front.sucess, blocks.front.data = turtle.inspect()
  blocks.down.sucess, blocks.down.data = turtle.inspectDown()
  --print(message)
  --if type(message)=="table" then for k,v in pairs(message) do print( k,v ) end end
  local a = {type="turtle_client",name="",SG_id = SG_id, id=t_id,message=message,fuel=fuel,inventory=inventory,blocks=blocks}
  if name == "" or name == nil then
    a.name = "Default Name"
  else
    a.name = name
  end
  --print(textutils.serializeJSON(a))
  return a
end

function Post(message, Url, appendURL)
  --print(myFun.ObjToJSON(make_packet(message)))
  --print(type(myFun.ObjToJSON(make_packet(message))))
  local custHead = {data = textutils.serializeJSON(make_packet(message))}
  local req,b,c = http.post(Url..appendURL, custHead["data"], custHead) --- it is possible that the http protocol is disabled. may need to come up with a fix
  if req == nil then
    print(req, b, c)
    --print(Url..appendURL)
    local resCode, resTitle = c.getResponseCode()
    print("ERROR ON POST: ("..resCode..") "..resTitle)
    return nil
  end
  local res = req.readAll()
  req.close()
  return res
end

function Start() --- add SG_id to the settings file
  settings.load("./.turtle")
  local Url = settings.get("addr")
  if Url == nil then
    print("")
    io.write("Enter Link to Server:\n>")
    Url = read()
  else
    print("")
    io.write("Would you like to change the address (current: "..Url..")\nPLEASE NOTE: a url does not need to contain any specific parameters; it can just be the domain of the server, and the port if necessary\n> ")
    local ans = read()
    if string.match(ans, "^y$") then
      print("")
      io.write("Enter Link to Server:\n> ")
      Url = read()
    elseif string.match(ans, "^yes$") then
      print("")
      io.write("Enter Link to Server:\n> ")
      Url = read()
    end
  end

  --print(Url)
  local base_url = string.sub(Url, 0, string.find(Url, "/turtle"))
  --print(base_url)

  local url = base_url
  if (string.find(Url, "https://") ~= nil and string.find(Url, "wss://") ~= nil) then
    url = "https://" .. url
  elseif (string.find(Url, "http://") ~= nil and string.find(Url, "ws://") ~= nil) then
    url = "http://" .. url
  end

  local check1 = http.checkURL(url) --- this is part of computercraft's api

  settings.set("addr", base_url)
  settings.save("./.turtle")

  if not check1 then
    print("The Link is Invalid")
    return 1
  end

  local base_wsUrl = base_url
  if (string.find(Url, "https://") ~= nil and string.find(Url, "wss://") == nil) then
    local a, s = string.find(Url, "https://")
    --print(a, s)
    base_wsUrl = "wss://" .. string.sub(base_wsUrl,s+1)
  elseif (string.find(Url, "http://") ~= nil ) then -- and string.find(Url, "ws://") ~= nil) then
    base_wsUrl = "ws://" .. base_wsUrl
  end
  -- if string.sub(url, 0, string.find(url, "https://")) then
  --   local b, c = string.find(url, "https://")
  --   if c == nil then b,c = string.find(url,"http://") end
  --   local a = string.sub(url, c+1, string.len(url))
  --   print(a,b,c)
  --   wsUrl = "wss://".. a
  -- end

  --print("base_url: "..base_url)
  -- print(base_wsUrl)
  --print(Url)


  if SG_id == nil then
    --print(Url)
    jsonData = Post('',url,"/turtle")
    if jsonData == nil then
      error("404 not found")
    end
    --print(jsonData)
    SG_id = myFun.JSONtoObj(jsonData).SG_id
    --print(SG_id)
  end

  local ws, wsUrl
  if SG_id ~= nil then
    local reason
    wsUrl = base_wsUrl.."/turtle/"..SG_id
    ws, reason = http.websocket(wsUrl)
    --print(wsUrl)
    if ws == false then
      print("Websocket connection failed: "..reason)
      error()
    end
    print("Connected to " .. base_url)
  end

  while true do
    --local jsonData = nil

    --print(ws)
    --local url, event, closeUrl, closeEvent

    --event, url, jsonData = os.pullEvent("websocket_message")
    --closeEvent, closeUrl = os.pullEvent("websocket_closed")
    local event = {os.pullEvent()}

    if event[1] == "websocket_closed" then
      print("the websocket at "..event[2].." was closed :(")
      error()
    end


    --print(event .. " " .. url .. " " .. jsonData)
    --print(closeEvent .. " " .. closeUrl)
    --until jsonData ~= nil or closeUrl == base_wsUrl.."/turtle/"..SG_id or textutils.unserializeJSON(jsonData).message ~= ""
    --jsonData = ws.receive()
    ---print(jsonData)

    if event[1] == "websocket_message" and event[3] ~= nil and event[3] ~= "" then
      --print(SG_id)
      --print(event[3])
      local data = textutils.unserializeJSON(event[3])
      if (data.message == nil) then data.message = "" end
      --for k,v in pairs(data) do print( k,v ) end
      if data.message ~= "" then
        local command_OUT = nil
        if data.isDone == false then
          if data.isRepeat == true then
            for i = data.doFor,0,-1 do
              --print(data.message)
              -- does data.doFor exist?

              local a
              command_OUT, a = Eval_cmd(data.message)
              if(a ~= "") then print(a) end
              data.times = data.times + 1
            end
            --command_OUT = Eval_cmd(data.message) --- i forget if this will work
            data.isDone = true
            data.rMsg = command_OUT
          end
          if data.isRepeat == false then
            command_OUT = Eval_cmd(data.message)
            data.isDone = true
            data.rMsg = command_OUT
          end
        end
        --print(data.rMsg)
        --print(textutils.serializeJSON(make_packet(data)))
        local packet = make_packet(data)
        ws.send(textutils.serializeJSON(packet))
      end
    end
    os.sleep(0.05) -- units in seconds, rounded to nearest 0.05
  end
end

if loaddeps() > 0 then
  print("Due to an error the program will now close")
elseif Start() > 0 then
  print("Due to an error the program will now close")
end
