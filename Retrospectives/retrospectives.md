# 🕘 Week 3 04/10/2024 

****
## Participants: All members



## What worked well
- Research on image search and learn to use the pre-trained model on hugging face
- Finish development environment Settings on image search.
- This week I think I did a good job with conversational product search based on a large language model and RAG; not only searching, but also giving the user some sensible recommendations. This is the first time I've been completely on my own, even though my teachers don't think it's that difficult, and I've been able to do this by reviewing the documentation, teaching myself python, RAG, grap, and vector databases.
- After researching found that Node js as a backend is suitable for us as we are familiar with typescript and node offers libraries and frameworks to keep the code clean. Started with Node js backend code setup.
- Complete development of Sign in and Sign up apis with JWT and Bcrypt integration.
- Setup for AWS RDS was done.

## What could be improved
- Image-to-text then perform text search，this will greatly reduce the accuracy.
- We also need to spend more time to learn Python language, Deep Learning, because no one in our group knows the part about DS, AI, so all three of us started from zero.

## What will we commit to doing in the next Sprint?
- Search image directly.
- Experimental image search using the Milvus vector database and the ResNet50 model; testing demos of 2D virtual try-on from three research papers.（Lin Cheng）

# 🕘 Week 4 11/10/2024 

****
## Participants: All members

## What worked well
- Explore how VTO impacts consumer behavior in online fashion shopping.
- Design experiment on collaborative feature.
- New apis were developed for products page. Also database normalisation was done to avoid data replication.
- Deployed application on Azure web apps using GitHub actions.
- Designed and implemented an image search based on Resnet50 model and Milvus;
- Research on the feasibility of the market for the try-on function to explore, whether VTO can have a role in promoting the consumption of fashion.
- We all focused on the project, everyone is doing his/her own task as well as he/she can, helping each other and sharing each other new knowledge, and learning new theories and techniques together.



## What could be improved
- The experimental design can be further optimized. 
- A locally deployed 2D virtual try-on was tested, but failed because the Mac laptop did not have a cuda-core graphics card and did not have enough RAM; the rest of the group continued with the task.
- Bad feedback during the presentation on the frontend design.



## What will we commit to doing in the next Sprint?
- Choose a suitable embedding model to implement image search.
- Test using postgresql+pgvector for image vectorization and search.
- Re-design UI

# 🕘 Week 5 18/10/2024 

****
## Participants: All members



## What worked well
- Understand the image search mechanism and choose the appropriate vector database.
- Study flask framework, and write API endpoint.
- For backend test cases were created for unit testing.
- After testing, we found that PostgreSQL+pgvector can not only fulfill relational data storage, but also can be used to store and search image vectors and text vectors, which is very suitable for our project needs. 


## What could be improved
- In terms of choosing an embedding model, the search and learning is not comprehensive enough, and it only focuses on the open source free models with high likes on Hugging Face. More comparisons of different models should be done.


## What will we commit to doing in the next Sprint?

- Find ways to make natural language search more precise. At present, the data set may not be comprehensive enough. The data set does not have more specific product descriptions such as seasons and wearing occasions, which may be one of the reasons affecting the search results.
- Interim reports and demos