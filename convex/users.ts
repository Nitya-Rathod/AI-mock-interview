import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUsers=mutation({
    args:{
        name:v.string(),
        email:v.string(),
        imageUrl:v.string()
    },
    handler:async(ctx,args) => {
        // If user already exist
        const user= await ctx.db.query('UserTabel').filter(
            q=>q.eq(q.field('email'),args.email)).collect();
        // If not then user new DB
        if(user?.length==0){
            const data ={
                email:args.email,
                imageUrl:args?.imageUrl,
                name:args.name
            }
            const result = await ctx.db.insert('UserTabel',{
                ...data
            });
            console.log(result);
            return {
                ...data,
                result
            }
        }
        return user[0];
    }
})