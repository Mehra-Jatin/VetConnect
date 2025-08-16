🐾 VetConnect

# 🐾 VetConnect

VetConnect is a veterinary consultation platform that allows users to connect with veterinarians online for seamless consultations, real-time chat, secure payments, and appointment management.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Real-time Communication**: Socket.io  
- **Payments**: Razorpay  
- **File Storage**: Cloudinary  

---

## 🔗 Live Demo  
[Click Here](https://vet-connect-chi.vercel.app/)  

⚠️ **Note**: It may take a few seconds to load the app as the backend is hosted on Render, which spins down the server after 15 minutes of inactivity.  

👉 Open the link in **two different browsers**.  
🚫 **Incognito mode** doesn’t support third-party cookies.  

---

## ✨ Features

- 👩‍⚕️ **Veterinary Consultation** – Book and manage appointments with vets.  
- 💬 **Real-time Chat** – Connect instantly with vets via chat powered by Socket.io.  
- 💳 **Secure Payments** – Pay consultation fees via Razorpay integration.  
- 📷 **Media Uploads** – Upload and share reports/images using Cloudinary.  
- 📅 **Appointment Scheduling** – Manage and track appointments easily.  
- 🔐 **Authentication & Authorization** – Secure login system with JWT.  

---

## 📦 Installation & Setup

### Clone the repository
```bash
git clone https://github.com/Mehra-Jatin/VetConnect.git
cd VetConnect
```

### Backend Setup
``` bash
cd backend
npm install
```

### Create a .env file in the server/ directory and add:
``` bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=
```


### Run the backend:
``` bash
npm start
```

### Frontend Setup
``` bash
cd frontend
npm install
```

### Create a .env file in the client/ directory and add:
```bash
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Run the frontend:
```bash
npm run dev
```
## 🤝 Contributing

Contributions are welcome! If you'd like to improve **VetConnect**:

1. **Fork** the repository  
2. **Create a new branch** (`feature/your-feature`)  
3. **Commit** your changes  
4. **Push** the branch  
5. Open a **Pull Request**  
