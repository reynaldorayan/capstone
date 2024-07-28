import Sentiments from "./sentiments";
import bg from "@/assets/About us.jpg";

export default async function page() {
    const bgStyles = {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${bg.src}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "top",
    };

    return (
        <div>
            <div
                className="text-4xl font-medium text-white min-h-72 flex justify-center items-center"
                style={{ ...bgStyles }}
            >
                All Reviews
            </div>
            <Sentiments />;
        </div>
    );
}
