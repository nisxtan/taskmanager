const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err) {
    const msgBag = {};
    if (err.inner && err.inner.length > 0) {
      err.inner.forEach((error) => {
        if (error.path) {
          msgBag[error.path] = error.message;
        }
      });
    }

    next({
      code: 400,
      detail: msgBag,
      message: "validation failed",
      status: "VALIDATION_FAILED",
    });
  }
};

module.exports = validateBody;
