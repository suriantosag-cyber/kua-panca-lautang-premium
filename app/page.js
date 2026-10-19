import HomeClient from './HomeClient';
import JadwalNikahServer from './components/JadwalNikahServer';

export default function Home() {
  return (
    <HomeClient jadwalSection={<JadwalNikahServer />} />
  );
}