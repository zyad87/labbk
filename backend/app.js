import express from 'express';
const app = express();
const port = 9000;

app.use(express.json()); 

const blogPosts = [];
const registeredUsers = [];

app.get('/posts', (req, res) => {
    res.json(blogPosts); 
});

app.post('/posts', (req, res) => {
    const { author, headline, content } = req.body;

    if (!author || !headline || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newPost = { id: blogPosts.length + 1, author, headline, content };
    blogPosts.push(newPost);
    res.status(201).json(newPost); 
});

app.patch('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { author, headline, content } = req.body;
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    post.author = author || post.author;
    post.headline = headline || post.headline;
    post.content = content || post.content;

    res.json(post);
});

app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = blogPosts.findIndex(p => p.id === postId);

    if (index === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    blogPosts.splice(index, 1); 
    res.status(204).send();
});

app.post('/register', (req, res) => {
    const { firstName, lastName, userEmail, userPassword } = req.body;

    if (!firstName || !lastName || !userEmail || !userPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = registeredUsers.find(u => u.userEmail === userEmail);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { id: registeredUsers.length + 1, firstName, lastName, userEmail, userPassword };
    registeredUsers.push(newUser);
    res.status(201).json(newUser); 
});

app.get('/register', (req, res) => {
    res.json(registeredUsers); 
});

app.post('/login', (req, res) => {
    const { userEmail, userPassword } = req.body;

    const user = registeredUsers.find(u => u.userEmail === userEmail);

    if (user && user.userPassword === userPassword) {
        return res.json({ message: 'Login success' });
    }

    res.status(401).json({ message: 'Invalid email or password' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
