local function loaddeps()
  -- removed in favor of textutils
  -- local loaddep1 = true require("json")
  -- if loaddep1 ~= true then
  --   return 1
  -- end
  local loaddep2 = require("myFun")
  if loaddep2 ~= true then
    return 1
  end
  return 0
end

-- Websocket_ip = "wss://d9f434060dba.ngrok.io"
Url = ""
os.setComputerLabel("")
t_id = os.getComputerID()

function Eval_cmd(command)
  local a = "return " .. command 
  local func, err = load(a)
  if func then 
      local ok, add = pcall(func)
      if ok then
        -- additional code to run when func is run
        --return ws.send(make_json(ok))
        print(ok)
        return add
      else
          --print("exec error: ", add)
          return "exec error: " .. add
      end
  else 
      --print("compilation error: ", err)
      return "compilation error: " .. err
  end
end

function make_json(message)
  -- derfine vars
  local name = os.getComputerLabel()
  local fuelLevel = turtle.getFuelLevel()
  local fuelLimit = turtle.getFuelLimit()
  -- inventory
  local inventory = {}
  inventory.selectedSlot = turtle.getSelectedSlot()
  inventory.slots = {}
  for i = 16,1,-1 do -- max,min,increment
    if type(turtle.getItemDetail(i)) == "table" then
      --print("is table")
      local item = turtle.getItemDetail(i)
      i_str = tostring(i)
      inventory.slots[i_str] = {}
      inventory.slots[i_str].name = tostring(item.name)
      inventory.slots[i_str].count = tostring(item.count)
      --print(inventory.slots[i_str].name)
      --print(inventory.slots[i_str].count)
      --print(ObjToJSON(inventory.slots))
    end
  end
  --print(inventory)
  -- rest of needed data
  local a = {type="turtle_client",name="",id=t_id,message=message,fuelLevel=fuelLevel,fuelLimit=fuelLimit,inventory=inventory}
  if name == "" or name == nil then
    a.name = "Default Name"
  else
    a.name = name
  end
  --print(a)
  local a_json = myFun.ObjToJSON(a)
  --print(a_json)
  return a_json
end

-- function Send(this, message)
--   this.send(make_json(message))
-- end
function Get()
  local a,b,c = http.get(Url.."/turtle")
  if a == nil then
    local resCode, resTitle = c.getResponseCode()
    print("("..resCode..") "..resTitle)
    return nil
  else
    local data = a.readAll()
    a.close()
    return data
  end
end
function Post(message)
  return http.post(Url, make_json(message))
end
function Start()
  settings.load("./.turtle")
  Url = settings.get("addr")
  if Url == nil then
    print("")
    io.write("Enter Link to Server: ")
    Url = read()
  else
    print("")
    io.write("Would you like to change the address (current: "..Url.."): ")
    local ans = read()
    if string.match(ans, "^y$") then
      print("")
      io.write("Enter Link to Server: ")
      Url = read()
    elseif string.match(ans, "^yes$") then
      print("")
      io.write("Enter Link to Server: ")
      Url = read()
    end
  end
  local check1 = http.checkURL(Url)
  settings.set("addr", Url)
  settings.save("./.turtle")
  if not check1 then
    print("The Link is Invalid")
    return 1
  end
  while true do
    local getCheck = 0
    local jsonData = Get()
    if jsonData == nil then
      getCheck = 1
    end
    if getCheck == 0 then
      print(jsonData)
      local data = myFun.JSONtoObj(jsonData)
    end
    os.sleep(10)
  end
  -- local ws = http.websocket(Websocket_ip)
  -- if ws == false then
  --   print("websocket connection has failed")
  --   print(ws)
  --   return 1
  --   --os.exit(0, true)
  -- end
  -- if ws == " " then
  --   print(ws)
  -- end
  -- print(make_json("computer label test"))
  -- if ws then
  --   print("> Connected")
  --   --local start_message = {type:'turtle_client'}
  --   --ws.send("")
  --   -- used for testing
  --   local label = os.getComputerLabel()
  --   print(label)
    
  --   ws.send(make_json("computer label test"))

  --   while true do
  --     print("a")
  --     print(ws.receive())
  --     local message = ws.receive()
  --     print(message)
  --     if message then  
  --       local obj = json.decode(message)
  --       print(obj.type)
  --       if obj.type == 'new_data' then
  --         --print(obj)
  --         os.setComputerLabel(obj.name)
  --       elseif obj.type == 'server' then
  --         if obj.isEval then
  --           --print(obj.isEval)
  --           --print(obj.command)
  --           --ws.send(Eval_cmd(obj.command))
  --           Send(ws,Eval_cmd(obj.command))
  --         else
  --           print(obj.command)
  --           print(obj.isEval)
  --         end
  --       else
  --         print("> Connection closed")
  --       end
  --     end
  --   end
  -- end
end

if loaddeps() > 0 then
  print("Do to an error the program will now close")
end

if Start() > 0 then
  print("Do to an error the program will now close")
end
