from ninja import NinjaAPI, Schema

api = NinjaAPI()

class HelloSchema(Schema):
  name: str = "flamengo"

@api.post("/hello")
def post_hello(request, data: HelloSchema):
  return {"message": f"Hello {data.name}"}

@api.get("/hello")
def hello(request, name):
  return {"message": f"Hello {name}"}

@api.get("/math/{a}and{b}")
def math(request, a:int, b:int):
  return {"add": a + b, "multiply": a * b}