import axios from 'axios'


export const currentUser = async (token) => await axios.post('http://localhost:5001/api/current-user', {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const currentAdmin = async (token) => {
    return await axios.post('http://localhost:5001/api/current-admin', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// ✅ เพิ่มฟังก์ชันสำหรับ Google Login
export const googlelogin = async (token) => 
    await axios.post('http://localhost:5001/auth/googlelogin', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });