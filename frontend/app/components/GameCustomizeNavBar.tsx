import Image from "next/image"
import logo from "../asset/bingo_logo.png"
import bell from "../asset/notification-bing.png"
import user from "./asset/user.png"
import { ArrowLeft, ChevronDown, ChevronUp, Link, Menu, UserRound } from "lucide-react"
import Navbar from "./Navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

type PageProps = {
  handleShareGameLink: () => void;
  isCopied: boolean;
}


const GameCustomizeNavBar = ({ handleShareGameLink, isCopied }: PageProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const router = useRouter()



  const handleShowMenu = () => {
    menuIsOpen === false ? setMenuIsOpen(true) : setMenuIsOpen(false);
  };
  const handleHowToPlayClick = () => {
  }
  const handleDisplayFriends = () => {
    setShowFriends(!showFriends);
  }

  return (
    <div className="w-full">
      <Navbar className="flex fixed bg-primary left-0 top-0 z-[999] justify-between">
        <div className="flex md:hidden justify-between items-center bg-transparent md:bg-[#fffdfd]">
          <Image src={user} alt="user" />
        </div>
        {menuIsOpen === false ? <button onClick={() => handleShareGameLink()} className="flex md:hidden items-center shadow-custom-inset bg-primary-yellow-300 rounded-[8px] gap-2 text-extra-small text-black justify-center py-[12px] px-4">
          <span>{isCopied ? 'Copied' : 'Share game link'}</span>
          <span><Link size={"14px"} /></span>
        </button> : ""}
        <div className="md:flex hidden items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center border rounded-[8px] gap-[.5em] border-primary-700 justify-center py-2 px-4 outline-1">
            <span><ArrowLeft color="#00658b" /></span>
            <span>Back</span>
          </button>
        </div>
        <div className="md:flex hidden gap-6 items-center">
          <button onClick={() => handleShareGameLink()} className="md:flex hidden items-center shadow-custom-inset bg-primary-yellow-300 rounded-[8px] gap-2 text-small text-black justify-center py-2 px-4">
            <span>{isCopied ? 'Copied' : 'Share game link'}</span>
            <span><Link size={"14px"} /></span>
          </button>
          <div className="md:flex hidden items-center flex-row-reverse gap-4">
            <button onClick={() => handleHowToPlayClick} className="flex items-center border rounded-[8px] gap-[.5em] border-primary-700 text-primary-700 justify-center py-2 px-4 outline-1">
              <span>?</span>
            </button>
            <div className="flex flex-col gap-1 relative">
              <button onClick={handleDisplayFriends} className="flex relative items-center gap-1 bg-primary-700 shadow-custom-inset rounded-[8px] gap[.5em] text-primary-100 justify-center py-[10px] px-4 outline-1">
                <span><UserRound /></span>
                <span>Friends</span>
                <span>{showFriends === true ? <ChevronUp /> : <ChevronDown />}</span>
              </button>
              {showFriends ? <ul className="flex absolute -bottom-[360%] z-[1000] w-[200%] bg-white rounded-xl right-0 flex-col p-4 gap-4">
                <li className="text-textColor-main">Friend 1</li>
                <li className="text-textColor-main">Friend 2</li>
                <li className="text-textColor-main">Friend 3</li>
              </ul> : ""}
            </div>
          </div>
        </div>
        <button onClick={(e) => {
          e.preventDefault()
          handleShowMenu()
        }} className="flex md:hidden shadow-custom-inset items-center bg-primary-700 border rounded-[8px] gap-[.5em] border-primary-700 text-white justify-center py-[12px] md:py-[10px] px-4 outline-1">
          <Menu />
        </button>
      </Navbar>
      {menuIsOpen === true ? <ul className="w-[100%] z-[995] md:hidden fixed top-[85px] flex gap-4 pt-[50px] flex-col min-h-[90vh] bg-white p-4 rounded-lg">
        <div className="flex flex-col gap-4">
          <p onClick={handleHowToPlayClick} className="text-textColor-main self-center cursor-pointer flex">How to play</p>
          <div className="flex flex-col gap-4 relative">
            <button onClick={handleDisplayFriends} className="flex relative items-center gap-1 bg-primary-700 shadow-custom-inset rounded-[8px] gap[.5em] text-primary-100 justify-center py-[10px] px-4 outline-1">
              <span><UserRound /></span>
              <span>Friends</span>
              <span>{showFriends === true ? <ChevronUp /> : <ChevronDown />}</span>
            </button>
            {showFriends ? <ul className="flex w-[100%] shadow-md bg-white rounded-lg right-0 flex-col p-4 gap-4">
              <li className="text-textColor-main">Friend 1</li>
              <li className="text-textColor-main">Friend 2</li>
              <li className="text-textColor-main">Friend 3</li>
            </ul> : ""}
          </div>
          <button onClick={() => router.push("/game-setting")} className="flex items-center shadow-custom-inset bg-button-light-main rounded-[8px] gap-2 text-small text-black justify-center py-2 px-4">
            Settings
          </button>
          <button onClick={() => handleShareGameLink()} className="flex items-center shadow-custom-inset bg-button-light-main rounded-[8px] gap-2 text-small text-black justify-center py-2 px-4">
            <span>Share game link</span>
            <span><Link size={"14px"} /></span>
          </button>
        </div>
      </ul> : ""}
    </div>
  )
}

export default GameCustomizeNavBar
