import "dotenv/config";
import { serverHttp } from "./app";
const PORT = process.env.PORT;

serverHttp.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));
