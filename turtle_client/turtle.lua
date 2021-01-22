--os.loadAPI("json")
local ws, err = http.websocket("e6f00edd206a.ngrok.io")
if err then
  print(err)
end
if ws then
  print("> Connected")
  ws.send("Hello")
  while true do
    local message = ws.receive()
    print(message)
    --local obj = json.decode(message)
    --if obj.type == 'eval' then

    --end
  end
end