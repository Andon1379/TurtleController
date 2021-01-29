os.loadAPI("json")

Websocket_ip = "1e4449834150.ngrok.io"
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
      --print(json.encode(inventory.slots))
    end
  end
  --print(inventory)
  -- rest of needed data
  local a = {type="turtle_client",name="",id=t_id,message=message,fuelLevel=fuelLevel,fuelLimit=fuelLimit,inventory=inventory}
  if name == "" or name == nil then
    a.name = ""
  else
    a.name = name
  end
  --print(a)
  local a_json = json.encode(a)
  --print(a_json)
  return a_json
end

function send(this, message)
  this.send(make_json(message))
end

local ws, err = http.websocket(Websocket_ip)
if err then
  print(err)
end
if ws then
  print("> Connected")
  --local start_message = {type:'turtle_client'}
  --ws.send("")
  -- used for testing
  local label = os.getComputerLabel()
  print(label)
  
  ws.send(make_json("computer label test"))

  while true do
    local message = ws.receive()
    print(message)
    if message then  
      local obj = json.decode(message)
      print(obj.type)
      if obj.type == 'new_data' then
        --print(obj)
        os.setComputerLabel(obj.name)
      elseif obj.type == 'server' then
        if obj.isEval then
          --print(obj.isEval)
          --print(obj.command)
          --ws.send(Eval_cmd(obj.command))
          send(ws,Eval_cmd(obj.command))
        else
          print(obj.command)
          print(obj.isEval)
        end
      else
        print("> Connection closed")
      end
    end
  end
end