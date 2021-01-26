os.loadAPI("json")

Websocket_ip = "f3785e6e5047.ngrok.io"
os.setComputerLabel("")

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
  local a = "return " .. command 
  local func, err = load(a)
  if func then 
      local ok, add = pcall(func)
      if ok then
        -- additional code to run when func is run 
        --print(ok)
      else
          print("exec error: ", add)
      end
  else 
      print("compilation error: ", err)
  end
end

function make_json(message)
  local name = os.getComputerLabel()
  local a = {type="turtle_client",name="",id=t_id,message=message}
  if name == "" then
    a = {type="turtle_client",name="",id=t_id,message=message}
  elseif name == nil then
    a = {type="turtle_client",name="",id=t_id,message=message}
  else
    a = {type="turtle_client",name=name,id=t_id,message=message}
  end
  print(a)
  local a_json = json.encode(a)
  --print(a_json)
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
          print(obj.isEval)
          print(obj.command)
          Eval_cmd(obj.command)
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
