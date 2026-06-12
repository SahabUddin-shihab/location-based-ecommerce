const app= require("./app");


const server= async()=>{
    const PORT= process.env.PORT || 5000;
    app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`);
    });
}

server();

