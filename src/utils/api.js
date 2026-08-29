const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function translateApiErrorMessage(message) {
  if (!message) return 'Terjadi kesalahan, silakan coba lagi.';

  const normalized = String(message).trim();

  const translations = {
    'email or password is wrong': 'Email atau kata sandi salah.',
    'email is invalid': 'Format email tidak valid.',
    'user with email already exists': 'Email sudah terdaftar.',
    'name is required': 'Nama wajib diisi.',
    'password is required': 'Kata sandi wajib diisi.',
    'password must be at least 6 characters': 'Kata sandi minimal 6 karakter.',
    'thread title is required': 'Judul thread wajib diisi.',
    'thread body is required': 'Isi thread wajib diisi.',
    'content is required': 'Konten komentar wajib diisi.',
    'authorization header is required': 'Anda perlu masuk terlebih dahulu.',
    'token is invalid': 'Sesi masuk tidak valid, silakan masuk kembali.',
  };

  const lower = normalized.toLowerCase();
  return translations[lower] || normalized;
}

export async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json') && !contentType.includes('+json')) {
    const rawText = await response.text();
    const safeMessage = rawText
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const detail = safeMessage ? ` (${safeMessage.slice(0, 120)})` : '';
    throw new Error(
      `Gagal memuat data dari server (${response.status} ${response.statusText})${detail}.`,
    );
  }

  try {
    const responseJson = await response.json();
    const {status, message, data} = responseJson;

    if (status !== 'success') {
      throw new Error(translateApiErrorMessage(message));
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Respon server tidak valid JSON (${response.status} ${response.statusText}).`,
      );
    }

    if (error instanceof Error) {
      throw new Error(translateApiErrorMessage(error.message));
    }

    throw error;
  }
}

/**
 * Fetch wrapper that parses the Dicoding Forum API envelope
 * and throws a readable Error when the request fails.
 * @param {string} url - The endpoint to call.
 * @param {object} options - Fetch options.
 * @return {Promise<object>} The `data` field of the API response.
 */
async function fetchWithEnvelope(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json') && !contentType.includes('+json')) {
    const rawText = await response.text();
    const safeMessage = rawText
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const detail = safeMessage ? ` (${safeMessage.slice(0, 120)})` : '';
    const message = `Request gagal (${response.status} ${response.statusText})${detail}.`;

    throw new Error(translateApiErrorMessage(message));
  }

  try {
    const responseJson = await response.json();
    const {status, message, data} = responseJson;

    if (!response.ok) {
      throw new Error(
        translateApiErrorMessage(
          message || `Request gagal (${response.status} ${response.statusText}).`,
        ),
      );
    }

    if (status !== 'success') {
      throw new Error(translateApiErrorMessage(message));
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Respon server tidak valid JSON (${response.status} ${response.statusText}).`,
      );
    }

    if (error instanceof Error) {
      throw new Error(translateApiErrorMessage(error.message));
    }

    throw error;
  }
}

/**
 * Build the Authorization header for authenticated requests.
 * @param {string} token - The user's access token.
 * @return {object} Headers object.
 */
function authHeader(token) {
  return {Authorization: `Bearer ${token}`};
}

const api = {
  putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  removeAccessToken() {
    localStorage.removeItem('accessToken');
  },

  async register({name, email, password}) {
    const {user} = await fetchWithEnvelope(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password}),
    });

    return user;
  },

  async login({email, password}) {
    const {token} = await fetchWithEnvelope(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });

    return token;
  },

  async getOwnProfile() {
    const accessToken = this.getAccessToken();
    const {user} = await fetchWithEnvelope(`${BASE_URL}/users/me`, {
      headers: authHeader(accessToken),
    });

    return user;
  },

  async getAllUsers() {
    const {users} = await fetchWithEnvelope(`${BASE_URL}/users`);
    return users;
  },

  async getAllThreads() {
    const {threads} = await fetchWithEnvelope(`${BASE_URL}/threads`);
    return threads;
  },

  async getThreadDetail(threadId) {
    const {detailThread} = await fetchWithEnvelope(`${BASE_URL}/threads/${threadId}`);
    return detailThread;
  },

  async createThread({title, body, category}) {
    const accessToken = this.getAccessToken();
    const {thread} = await fetchWithEnvelope(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(accessToken),
      },
      body: JSON.stringify({title, body, category}),
    });

    return thread;
  },

  async createComment({threadId, content}) {
    const accessToken = this.getAccessToken();
    const {comment} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(accessToken),
        },
        body: JSON.stringify({content}),
      },
    );

    return comment;
  },

  async upVoteThread(threadId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/up-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async downVoteThread(threadId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/down-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async neutralizeThreadVote(threadId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/neutral-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async upVoteComment(threadId, commentId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async downVoteComment(threadId, commentId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async neutralizeCommentVote(threadId, commentId) {
    const accessToken = this.getAccessToken();
    const {vote} = await fetchWithEnvelope(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      {method: 'POST', headers: authHeader(accessToken)},
    );

    return vote;
  },

  async getLeaderboards() {
    const {leaderboards} = await fetchWithEnvelope(`${BASE_URL}/leaderboards`);
    return leaderboards;
  },
};

export default api;
