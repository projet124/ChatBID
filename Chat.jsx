import React, { useState, useEffect } from 'react'
import { playVoice } from '../components/VoicePlayer'
import { getAIResponse } from '../utils/openai'
import { saveMessage, getHistory, clearHistory } from '../utils/chatStorage'

const Chat = () => {
  const [style, setStyle] = useState('professionnel')
  const [userMessage, setUserMessage] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleSend = async () => {
    if (!userMessage.trim()) return
    setLoading(true)
    saveMessage('user', userMessage)

    try {
      const reply = await getAIResponse(userMessage)
      saveMessage('assistant', reply)
      setHistory(getHistory())
      playVoice(reply, style)
    } catch (error) {
      saveMessage('assistant', '❌ Erreur lors de la réponse IA.')
    }

    setUserMessage('')
    setLoading(false)
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">💬 Chat IA Business</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">🎭 Style de l'IA</label>
        <select
          onChange={(e) => setStyle(e.target.value)}
          value={style}
          className="w-full p-2 border rounded"
        >
          <option value="professionnel">Professionnel</option>
          <option value="vendeur">Vendeur</option>
          <option value="fun">Fun</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">📝 Votre message</label>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="w-full p-3 border rounded"
          rows="4"
          placeholder="Posez votre question ici..."
        />
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded w-full"
        >
          {loading ? '⏳ Réponse en cours...' : '🚀 Envoyer à l’IA'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded w-full"
        >
          🗑️ Effacer l’historique
        </button>
      </div>

      <div className="space-y-4">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded shadow ${
              msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <strong>{msg.role === 'user' ? '👤 Vous' : '🤖 IA'} :</strong>
            <p className="mt-2">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chat
