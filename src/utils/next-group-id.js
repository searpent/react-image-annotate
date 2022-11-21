import { v4 as uuidv4 } from 'uuid';

function nextGroupId() {
  return uuidv4();
}

export default nextGroupId;