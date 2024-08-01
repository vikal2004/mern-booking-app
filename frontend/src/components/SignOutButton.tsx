import { useMutation, useQueryClient, useQueryErrorResetBoundary } from "react-query"
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext"

const SignOutButton = () => {
    const queryClient=useQueryClient();
    const {showToast}=useAppContext();
    const mutation=useMutation(apiClient.signOut,{
        onSuccess: async ()=>{
            await queryClient.invalidateQueries("validateToken");
            //showToast
            showToast({message:"Signed OUt", type:"SUCCESS"});
        }, 
        onError:(error:Error)=>{
            //show Toast
            showToast({message:error.message, type:"ERROR"});
        }
    })

    const handleClick=()=>{
        mutation.mutate();
    }
  return (
    <div onClick={handleClick} className="text-blue-600 flex items-center px-3 font-bold bg-white hover:bg-gray-100">Sign out</div>
  )
}

export default SignOutButton