import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'
import PlusIcon from '../icons/PlusIcon'
import ShareIcon from '../icons/ShareIcon'
import { useEffect, useState } from 'react'
import { useContent } from '../hooks/useContent'
import axios from 'axios'

const Dashboard = () => {

  const [modal, setModal] = useState(false);
  const { contents, refresh } = useContent()

  useEffect(()=>{
    refresh
  }, [modal])

  async function shareBrain(){
    const response = await axios.post("http://localhost:3000/api/v1/brain/share",{
        share:true
    },{
        headers:{
            "Authorization": localStorage.getItem("token")
        }
    })
    const url = `http://localhost:5173/share/${response.data.hash}`;
  }
  return (
    <div>
      <Sidebar />
      <div className='p-4 ml-76 min-h-screen bg-gray-100'>
        <Modal open={modal} onClose={() => {
          setModal(false)
        }}/>
        <div className="flex justify-end gap-4">
          <Button 
              startIcon={<PlusIcon size='md'/>} 
              variant='primary' 
              text='Add Content' 
              size='sm' 
              onClick={() =>{
                setModal(true)
              }}>
          </Button>
          <Button 
              startIcon={<ShareIcon size='md'/>} 
              variant='secondary' 
              text='Share Brain' 
              size='sm'
              onClick={shareBrain}>
          </Button>
        </div>

        <div className="flex p-4 gap-15 flex-wrap">
            {/* {JSON.stringify(contents)} */}
            {contents.map(({ type, link, title }) => {
                return <Card key={link} type={type} link={link} title={title} />;
            })}

          {/* <Card type="youtube" title='Tech Burner' link='https://www.youtube.com/watch?v=qcmekgbU_KE'/> 
          <Card type="twitter" title='CSK' link='https://twitter.com/IPL/status/1960629619775721945'/>
          <Card type="notion" title='Project Ideas' link="https://marvelous-apartment-ecc.notion.site/ebd/25d0353df78d8070bdfdd4f24b4b732e"/> */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
