import { PARTNERS_ROUTE } from "@/utils/consts";
import { useTranslate } from "@/utils/useTranslate";
import { observer } from "mobx-react-lite";
import { FaUserFriends } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

const AffiliateCard = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslate();

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
                {t('affiliate')}
            </div>
        </div>
        <div className="text-sm text-muted-foreground">
            {t('invite_friends')}
        </div>
    </div>
  )
});

export default AffiliateCard