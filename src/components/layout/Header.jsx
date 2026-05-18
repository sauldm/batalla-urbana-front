import Title from "../Title";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-game-highlight/50 bg-game-modal shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Title text="Batalla Urbana" />
      </div>
    </header>
  );
};

export default Header;
