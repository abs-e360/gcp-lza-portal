
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Radio } from "@mui/joy";

import { setTermsAccepted } from "../../store/store";
import TOS from "../../components/TOS/TOS";
import './Terms.css';

const Terms = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const termsAccepted = useSelector((state: any) => state.onboard.termsAccepted);

    return (
        <div>
            <TOS />
            <div id="terms-button-bar">
                <div>
                    <Radio
                        required
                        checked={termsAccepted}
                        onChange={(e) => dispatch(setTermsAccepted(e.target.checked))}
                    />
                    <label onClick={() => dispatch(setTermsAccepted(!termsAccepted))} style={{ padding: '0 16px' }}>
                        By checking this box, you agree to our terms of service.
                    </label>
                </div>
                <Button id="terms-accept-Button" size='lg' onClick={() => navigate('/onboard')} disabled={!termsAccepted}>
                    Accept
                </Button>
            </div>
        </div>
    );
}

export default Terms;