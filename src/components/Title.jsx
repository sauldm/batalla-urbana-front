import { IMAGES } from "../utils/images";
const logo = IMAGES.logo;

export default function Title({ text }) {
    return (
        <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-16 w-16 rounded-full object-cover" />
            <h1 className="font-title text-title">
                {text}
            </h1>
        </div>
    );
}

export { Title };