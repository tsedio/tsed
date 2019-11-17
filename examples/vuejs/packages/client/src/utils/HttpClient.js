import 'whatwg-fetch'

async function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response

  throw error
}

const extractBody = response => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json()
  }
  return response.text()
}

export default {
  async get (url) {
    const response = await checkStatus(await fetch(url, {
      method: 'GET'
    }))

    return extractBody(response)
  },

  async post (url, body, { headers = {}, ...options }) {
    const response = await checkStatus(await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options
    }))

    return extractBody(response)
  }
}
