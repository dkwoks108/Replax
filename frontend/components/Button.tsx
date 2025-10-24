/* filepath: frontend/components/Button.tsx
   Compatibility wrapper: ensures a default export for consumers that import '@/components/Button'
*/
import * as ButtonModule from './ButtonImpl';
const ButtonDefault: any = (ButtonModule as any).default ?? (ButtonModule as any).Button ?? (props => null);
export default ButtonDefault;
