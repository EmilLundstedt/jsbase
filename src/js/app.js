import { button, paragraph } from "./vendor";
import "../css/main.css";
button.addEventListener("click", () => {
    paragraph.textContent = "Hej";
});
