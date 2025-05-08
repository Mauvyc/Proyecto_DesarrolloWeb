/**
 * Formateador de respuestas para mantener consistencia en la API
 */
class ResponseFormatter {
  /**
   * Formatear respuesta exitosa
   * @param {Object} data - Datos de respuesta
   * @param {string} message - Mensaje de éxito
   * @param {number} statusCode - Código de estado HTTP (default: 200)
   * @returns {Object} - Respuesta formateada
   */
  static success(data = null, message = 'Operación exitosa', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  /**
   * Formatear respuesta de error
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código de estado HTTP (default: 400)
   * @param {Object} error - Detalles del error
   * @returns {Object} - Respuesta formateada
   */
  static error(message = 'Error en la operación', statusCode = 400, error = null) {
    return {
      success: false,
      message,
      error,
      statusCode
    };
  }

  /**
   * Enviar respuesta al cliente
   * @param {Object} res - Objeto de respuesta Express
   * @param {Object} formattedResponse - Respuesta formateada
   */
  static send(res, formattedResponse) {
    const { statusCode, ...responseBody } = formattedResponse;
    res.status(statusCode).json(responseBody);
  }
}

export default ResponseFormatter; 