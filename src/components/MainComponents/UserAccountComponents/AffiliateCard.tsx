import { PARTNERS_ROUTE } from "@/utils/consts";
import { FaUserFriends } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

const AffiliateCard = () => {
  const navigate = useNavigate();

  return (
    <div 
        onClick={() => {
         navigate(PARTNERS_ROUTE);
        }}
        className="flex flex-col space-y-1.5 p-[12px] border bg-black rounded-xl w-full"
        style={{
            border: "1px solid rgb(38, 38, 38)",
            backgroundColor: "hsl(0 1% 10%)",
        }}
    >
        <div className="flex items-center gap-2">
            <FaUserFriends /> 
            <div className="text-[16px] font-semibold">
                Affiliate
            </div>
        </div>
        <div className="text-sm text-muted-foreground">
            Invite friends and get rewards
        </div>
    </div>
  )
}

export default AffiliateCard