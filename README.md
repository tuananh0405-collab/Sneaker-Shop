<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Sneaker Shop</h3>

  <p align="center">
    A fullstack e-commerce application built with React Native (Expo) and Node.js (Express)!
    <br />
    <a href="#getting-started"><strong>Get Started »</strong></a>
    <br />
  </p>
</div>

## Table of Contents
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About The Project

This is a full-featured e-commerce application for mobile built using **React Native (Expo)** on the client and **Node.js with Express** on the server. Users can browse products, manage their cart, apply discount codes, and place orders. The backend handles authentication, product and order management, and coupon logic.

### Built With

* [React Native (Expo)](https://expo.dev)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Tailwind CSS (Nativewind)](https://www.nativewind.dev/)
* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [JWT](https://jwt.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1. **Clone the repo**
```sh
git clone https://github.com/tuananh0405-collab/Sneaker-Shop
cd e-commerce
```

2. **Install dependencies**
```sh
cd client
npm install
cd ../server
npm install
```
##  Features

### 📱 Client (React Native - Expo)
- User Login / Register
- Product browsing & details
- Shopping cart with quantity control
- Coupon code applying
- Mobile-first UI using TailwindCSS
- State management using Redux Toolkit

### 🔧 Server (Node.js + Express)
- RESTful API
- JWT-based Authentication
- MongoDB with Mongoose
- User, Product, Order, and Coupon models
- Error handling, middleware, and validation

---

## 🛠 Technologies

| Layer       | Technology                         |
|-------------|------------------------------------|
| Frontend    | React Native, Redux Toolkit, Axios |
| Backend     | Node.js, Express.js                |
| Database    | MongoDB + Mongoose                 |
| Auth        | JSON Web Tokens (JWT)              |
| Styling     | Tailwind CSS via Nativewind        |
| Tools       | dotenv, nodemon, ESLint, Prettier  |

---


### Environment Variables

Create a `.env.development.local` file in the `server` folder and add:
```env
PORT = 
NODE_ENV="development"
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
EMAIL_PASSWORD=
EMAIL_ACCOUNT=

#CLOUDINARY
CLOUDINARY_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET =

#VNPAY
VNP_TMN_CODE=
VNP_HASH_SECRET=
VNP_URL=
VNP_RETURN_URL=
VNP_API_URL=

#GOOGLE OAUTH
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_BASE_URL=
```

## Usage

Start the backend server:
```sh
cd server
npm run dev
```

Start the client with Expo:
```sh
cd ../client
npx expo start
```

Use Expo Go app or a simulator to preview the app.

## Roadmap

- [x] Mobile shopping experience
- [x] JWT authentication
- [x] Redux-powered cart
- [x] Coupon applying
- [x] VnPay integration
- [x] Admin dashboard
- [ ] Product ratings & reviews

## Contributing

Contributions are welcome! Feel free to fork the project and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

Your Name
Email: vutuananh0405@gmail.com
Project Link: [https://github.com/tuananh0405-collab/Sneaker-Shop](https://github.com/tuananh0405-collab/Sneaker-Shop)

<!-- SHIELDS -->
[contributors-shield]: https://img.shields.io/github/contributors/your-username/ecommerce-app.svg?style=for-the-badge
[contributors-url]: https://github.com/your-username/ecommerce-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your-username/ecommerce-app.svg?style=for-the-badge
[forks-url]: https://github.com/your-username/ecommerce-app/network/members
[stars-shield]: https://img.shields.io/github/stars/your-username/ecommerce-app.svg?style=for-the-badge
[stars-url]: https://github.com/your-username/ecommerce-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/your-username/ecommerce-app.svg?style=for-the-badge
[issues-url]: https://github.com/your-username/ecommerce-app/issues
[license-shield]: https://img.shields.io/github/license/your-username/ecommerce-app.svg?style=for-the-badge
[license-url]: https://github.com/your-username/ecommerce-app/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/yourprofile

