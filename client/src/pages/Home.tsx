import useAppStore from "../store";

export default function Home() {
  const { userData } = useAppStore();

  return <div>hello {userData.name}</div>;
}
