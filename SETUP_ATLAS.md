# Setup MongoDB Atlas (Cloud - Free)

No installation required, just a free account.

## Steps

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Create a free cluster (M0 - Free tier)
   - Choose a cloud provider (AWS, Google, Azure)
   - Choose a region close to you
   - Name it whatever you want
   - Click "Create Cluster"
4. Wait 3-5 minutes for cluster to be created
5. Create database user:
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or whatever you want)
   - Password: Generate a secure one and SAVE IT
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
6. Whitelist your IP:
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP
   - Click "Confirm"
7. Get connection string:
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
8. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/products?retryWrites=true&w=majority
   ```
   Replace:
   - `admin` with your username
   - `TU_PASSWORD` with your password
   - `cluster0.xxxxx` with your actual cluster name
   - Add `/products` before the `?` to specify the database name

9. Run your app:
   ```bash
   npm run start:dev
   ```

That's it! No installation needed.
