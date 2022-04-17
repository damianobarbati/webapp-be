import asyncStorage from './asyncStorage.js';

export class HTTP_Error extends Error {
  constructor(message, http_code) {
    super(message);
    Error.captureStackTrace(this, HTTP_Error);
    this.name = this.constructor.name.replace('_Error', http_code);
    this.http_code = http_code;
    this.id_transaction = asyncStorage.getStore()?.id_transaction; // undefined if outside of http lifecycle
  }
}

export class HTTP400 extends HTTP_Error {
  constructor(message = 'Bad request.') {
    super(message, 400);
  }
}

export class HTTP401 extends HTTP_Error {
  constructor(message = 'Unauthorized.') {
    super(message, 401);
  }
}

export class HTTP403 extends HTTP_Error {
  constructor(message = 'Forbidden.') {
    super(message, 403);
  }
}

export class HTTP404 extends HTTP_Error {
  constructor(message = 'Not found.') {
    super(message, 404);
  }
}

export class HTTP409 extends HTTP_Error {
  constructor(message = 'Conflict.') {
    super(message, 409);
  }
}

export class HTTP410 extends HTTP_Error {
  constructor(message = 'Gone.') {
    super(message, 410);
  }
}

export class HTTP413 extends HTTP_Error {
  constructor(message = 'Payload Too Large.') {
    super(message, 413);
  }
}

export class HTTP422 extends HTTP_Error {
  constructor(message = 'Unprocessable entity.') {
    super(message, 422);
  }
}

export class HTTP425 extends HTTP_Error {
  constructor(message = 'Too Early.') {
    super(message, 425);
  }
}

export class HTTP500 extends HTTP_Error {
  constructor(message = 'Internal server error.') {
    super(message, 500);
  }
}
