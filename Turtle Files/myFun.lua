textutils = textutils
local function ObjToJSON(str)
  return textutils.serializeJSON(str)
end
local function JSONtoObj(str)
  return textutils.unserializeJSON(str)
end
local function FindKeysInTable(table)
  local data = ""
  for index in pairs(table) do
    data = data.." "..index
  end
  return data
end

myFun = {ObjToJSON = ObjToJSON, JSONtoObj = JSONtoObj, FindKeysInTable = FindKeysInTable}
