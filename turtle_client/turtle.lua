os.loadAPI("json")
local ws, err = http.websocket("db9fcbe68c86.ngrok.io")
if err then
  print(err)
end
if ws then
  print("> Connected")
  ws.send("")
  while true do
    local message = ws.receive()
    print(message)
    local obj = json.decode(message)
    if obj.type == 'eval' then
      Eval_cmd(obj.command)
    --Send("hello")
    end
  end
end

function Send(text)
  ws.send("tur_client: " + text)
end

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