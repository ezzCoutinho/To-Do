class HttpNotFound(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message
        self.name = "HttpNotFound"
        self.status_code = 404
