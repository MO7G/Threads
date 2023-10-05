export async function GetCurrentUser(clerkCurrentUserApi:()=>Promise<any>) {
  try {
    return await clerkCurrentUserApi();
  } catch (error) {
    console.error("Something is wrong with the internet can't fetch user from clerk", error)
  }
}