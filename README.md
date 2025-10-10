# birthday guestbook | [![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

create a birthday guestbook for a friend and get everyone to sign it! for the level up challenge

## features
- sketchpad where you can draw with any color and any size brush
- message inputs for birthday wishes and names
- image storage using imgbb api to save drawings
- share links to send to friends and family
- mongodb storage for consistent guestbook entries

## usage
1. create a new guestbook and get a unique link
2. share the link with friends and family
3. people can leave messages and draw pictures
4. view all entries in a display link

## installation  
1. **Clone the repository**
   ```bash
   git clone https://github.com/sophia0805/birthday-card
   cd birthday-card
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a .env.local**
    ```env
    MONGODB_URI=""
    IMGBBKEY=""
    ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## history
this was my first time using a mongo database to store data. i struggled with debugging tls errors before finding out that you have to add your ip address to the whitelist and deploying with vercel.

## finished product
![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/5d8ff58345559d95ad4930fb6a2c208ac6ca4b21_image.png)