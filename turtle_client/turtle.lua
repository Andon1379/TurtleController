os.loadAPI("json")

Websocket_ip = "6547948ccb19.ngrok.io"

t_id = os.getComputerID()

--Turtle_obj = {
--  id = t_id;
--  name = nil;
--  rel_x = 0;
--  rel_y = 0;
--  rel_z = 0;
--}
--function Turtle_obj.create (self,id,name,x,y,z)
--  self = Turtle_obj;
--  self.id=os.getComputerID();
--  self.name=name;
--  self.rel_x = x;
--  self.rel_y = y;
--  self.rel_z = z;
--  return self
--end

function Eval_cmd(command) 
local func, err = load("return " + command)
  if func then 
      local ok, add = pcall(func)
      if ok then
          -- additional code to run when func is run 
        
      else
          print("exec error: ", add)
      end
  else 
      print("compilation error: ", err)
  end
end

function New_name(name)
  local a = {type="turtle_client",name=name,id=t_id,message="hi"}
  local a_json = json.encode(a)
  print(a_json)
  return a_json
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
  if label == "" then
    ws.send(New_name(""))
  elseif label == nil then
    ws.send(New_name(""))
  else
    ws.send(New_name(label))
  end
  while true do
    local message = ws.receive()
    print(message)
    local obj = json.decode(message)
    print(obj)
    if obj.type == 'eval' then
      --Eval_cmd(obj.command)
      print(obj)
    --Send("hello")
    end
    if obj.type == 'new_data' then
      print(obj)
      os.setComputerLabel(obj.name)
    end
  end
end