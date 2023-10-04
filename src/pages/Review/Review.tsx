import { useSelector } from "react-redux";

const Review = () => {
    const onboard = useSelector((state: any) => state.onboard);
    console.log(onboard);

    return (
        <div>
            <h1>Review</h1>
        </div>
    );
};

export default Review;

