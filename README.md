# `Web3.0 Private Account Trading Platform`

> Secure transactions for buyers and sellers, powered by blockchain technology.

🚀Website: http://81.70.13.43:3000/

Welcome to our Web3.0 Private Account Trading Platform! Our platform is designed to enable buyers and sellers to securely complete transactions without the need for mutual trust. Powered by blockchain technology, we ensure transparency, security, and fairness for every trade.

With features like decentralized fund escrow, real-time trade progress tracking, and dynamic 2FA verification, our platform revolutionizes the way digital assets are exchanged, offering a seamless and secure trading experience for both buyers and sellers.

Our project is built on top of this [boilerplate](https://github.com/ethereum-boilerplate/ethereum-boilerplate). Thanks to the boilerplate creators for their contribution. Without their efforts, there would be no such project.

Learn more in [this page](http://81.70.13.43:3000/learn)!

# ⭐️ `Star us`

If you consider this project helpful - please star this project, every star makes us very happy!

# 🤝 `Need help?`

If you need help with setting up the project or have other questions - don't hesitate to contact us!
You may see our contact details in the bottom of our website.

# 🚀 `Quick Start`


💿 Install all dependencies:

```sh
cd Web3.0_PrivateAccountTradingPlatform
yarn install
```

✏ Rename `.env.local.example` to `.env.local` and provide required data. Get your Web3 Api Key from the [Moralis dashboard](https://admin.moralis.io/):

![image](https://user-images.githubusercontent.com/78314301/186810270-7c365d43-ebb8-4546-a383-32983fbacef9.png)

🖊️ Fill the environment variables in your .env.local file in the app root:

- `MORALIS_API_KEY`: You can get it [here](https://admin.moralis.io/web3apis).
- `NEXTAUTH_URL`: Your app address. In the development stage, use http://localhost:3000.

You might also need to add more environment variables if you want to try on your own.

Example:

```
MORALIS_API_KEY=xxxx
NEXTAUTH_URL=http://localhost:3000
more...
```

🚴‍♂️ Build and Run your App:

```sh
yarn build
yarn start
```

