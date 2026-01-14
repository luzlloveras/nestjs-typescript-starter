# After Creating the Atlas Cluster

Follow these steps once your free cluster is ready.

## 1) Create a database user
- Left menu → "Database Access"
- "Add New Database User"
- Auth: Password
- Username: `admin` (or your choice)
- Password: generate and save it
- Privileges: "Read and write to any database"
- Click "Add User"

## 2) Allow network access
- Left menu → "Network Access"
- "Add IP Address"
- For development: "Allow Access from Anywhere" (0.0.0.0/0)
- Or add your current IP
- Click "Confirm"

## 3) Get the connection string
- Left menu → "Database"
- Click "Connect" on your cluster
- Choose "Connect your application"
- Driver: Node.js
- Copy the connection string (looks like `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

## 4) Update `.env`
Replace the URI with your values and specify the `products` database:

```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/products?retryWrites=true&w=majority
```

What to replace:
- `admin` → your username
- `YOUR_PASSWORD` → the password you saved
- `cluster0.xxxxx` → your cluster host name

## 5) Run the app
```bash
npm run start:dev
```
