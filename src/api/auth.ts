// const url = 'http://localhost:8000'
const url = 'https://grocerydelivery-api.onrender.com'

//helper function to handle api responses and errors
const handleApiResponse = async (res: Response) => {
  let errorMessage = `request failed wit status ${res.status}: ${res.statusText}`
  if (!res.ok) {
    try {
      //try parsing the json
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } else {
        // If not JSON, try to read as text
        const errorText = await res.text()
        if (errorText) {
          errorMessage = errorText
        }
      }
    } catch (parseError) {
      // If parsing fails, use the default error message
      console.warn('Failed to parse error response:', parseError)
    }
    throw new Error(errorMessage)
  }
  return res;
}

export const LoginUser = async (email: string, password: string, otp: string) => {
    try {
      const res = await fetch(`${url}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, otp }),
      })
      await handleApiResponse(res)
  
      return res.json();
  
  } catch(e){
      console.error('Login failed:', e);
  }
}

export const RegisterUser = async (email: string, password: string, full_name: string, phone_number: string) => {
  try {
    const res = await fetch(`${url}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name, phone_number }),
    })
    await handleApiResponse(res)

    return res.json();

  } catch(e){
      console.error('Registration failed:', e);
  }
}
export const LogOutUser = async() => {
  try {
    const res = await fetch(`${url}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await handleApiResponse(res)

    return res.json();

  } catch(e){
      console.error('Logout failed:', e);
  }
}