from ninja import NinjaAPI

api = NinjaAPI()

@api.get("/hello")
def hello(request, name):
  return {"message": f"Hello {name}"}

@api.get("/math/{a}and{b}")
def math(request, a:int, b:int):
  return {"add": a + b, "multiply": a * b}