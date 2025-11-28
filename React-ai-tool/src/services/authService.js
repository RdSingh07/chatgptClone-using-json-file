// Auth service for handling user authentication with JSON localStorage storage

const STORAGE_KEY = "chatgpt_clone_users";

// Get all users from localStorage
export const getUsers = () => {
  const usersJson = localStorage.getItem(STORAGE_KEY);
  if (!usersJson) {
    return [];
  }
  try {
    const parsed = JSON.parse(usersJson);
    // Ensure we always return an array
    if (!Array.isArray(parsed)) {
      console.warn("Users data is not an array, resetting to empty array");
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error parsing users data:", error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users data:", error);
    throw new Error("Failed to save user data");
  }
};

// Signup - Register a new user
export const signup = (email, password, name) => {
  const users = getUsers();

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user object
  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In production, this should be hashed
    name: name || email.split("@")[0],
    createdAt: new Date().toISOString(),
  };

  // Add user to array
  users.push(newUser);

  // Save to localStorage
  saveUsers(users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login - Authenticate user
export const login = (email, password) => {
  const users = getUsers();

  // Find user by email
  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  // Check password
  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get current user from session
export const getCurrentUser = () => {
  const userJson = sessionStorage.getItem("current_user");
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing current user:", error);
    return null;
  }
};

// Set current user in session
export const setCurrentUser = (user) => {
  if (user) {
    sessionStorage.setItem("current_user", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("current_user");
  }
};

// Logout - Clear current user
export const logout = () => {
  sessionStorage.removeItem("current_user");
};
