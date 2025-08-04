export const sendSuccessResponse = (data: any) => {
  return {
    status: true,
    data: data
  }
}

export const sendErrorResponse = (data: any) => {
  return {
    status: false,
    data: data
  }
}
