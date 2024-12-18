import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCoins, FaSearch, FaUserCircle, FaRegFrown } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import Header from '../../Components/Common/Header';
import { getZcoinsData, sendZcoins ,searchUsers } from '../../Services/apiServices';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const CoinBalance = ({ balance }) => {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg p-8 relative overflow-hidden text-white 
      hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      
      <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-10 -translate-y-10
        group-hover:translate-x-8 group-hover:-translate-y-8 transition-all duration-300">
        <div className="w-full h-full bg-white/10 rounded-full"></div>
      </div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 transform
        group-hover:-translate-x-2 group-hover:translate-y-2 transition-all duration-300">
        <div className="w-full h-full bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <FaCoins className="text-yellow-300 text-2xl group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-2xl font-medium text-white/90">Balance</h2>
        </div>
        <div className="flex items-baseline gap-2 mb-3 group-hover:translate-x-1 transition-transform duration-300">
          <span className="text-5xl font-bold">{balance}</span>
          <span className="text-xl opacity-90">coins</span>
        </div>
        <p className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
          Use coins to pay on your next order
        </p>
      </div>
    </div>
  );
};

CoinBalance.propTypes = {
  balance: PropTypes.number.isRequired,
};

const UserSearchResult = ({ user, onSelect, selected }) => {
  return (
    <div 
      onClick={() => onSelect(user)}
      className={`flex items-center gap-4 p-4 ${selected ? 'bg-orange-50' : 'hover:bg-gray-50'} 
        cursor-pointer transition-colors rounded-lg border-2 ${selected ? 'border-orange-400' : 'border-transparent'}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selected ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
        {user.profilePicture ? (
          <img 
          referrerPolicy='no-referrer'
          src={user?.profilePicture} alt={user.fullname} 
          className="w-full h-full object-cover rounded-full" />
        ) : (
          <FaUserCircle className="text-2xl" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{user.fullname}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      {selected && (
        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
      )}
    </div>
  );
};

UserSearchResult.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Coins = () => {
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchQuery = useDebounce(userSearchQuery, 500);
  const fetchBalanceAndUsers = async () => {
    try {
      const response = await getZcoinsData();
      setBalance(response.data.zcoins.balance);
      const lastSentUsers = response.data.zcoins.lastSentUserIds;
      if (lastSentUsers.length > 0) {
        setUsers(lastSentUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching coins or users:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBalanceAndUsers();
  }, []);

  useEffect(() => {
    const searchForUsers = async () => {
      if (debouncedSearchQuery.trim()) {
        try {
          const response = await searchUsers(debouncedSearchQuery);
          setSearchResults(response.data.users);
        } catch (error) {
          console.error('Error searching users:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    searchForUsers();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e) => {
    setUserSearchQuery(e.target.value);
  };

  const handleShare = async () => {
    try {
      const amountNum = parseInt(amount);
      if (selectedUser && amountNum) {
        await sendZcoins({ receiverId: selectedUser._id, amountNum });
        toast.success('Coins sent successfully');
      }
      setAmount('');
      fetchBalanceAndUsers()
      setSelectedUser(null)
    } catch (error) {
      console.error('Error sending coins:', error);
      toast.error('Error sending coins');
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50"
    >
      <ToastContainer position='top-right'/>
      <Header 
        searchQuery={headerSearchQuery}
        onSearchChange={setHeaderSearchQuery}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Coins</h1>
        
        {/* Coin Balance */}
        {loading ? (
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg p-8 relative overflow-hidden text-white">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
            </div>
          </div>
        ) : (
          <CoinBalance balance={balance} />
        )}

        {/* Share Coins Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Coins</h2>
          
          {/* Search and Amount Input */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Search */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={userSearchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <UserSearchResult
                      key={user._id}
                      user={user}
                      onSelect={setSelectedUser}
                      selected={selectedUser?._id === user._id}
                    />
                  ))
                ) : users.length > 0 ? (
                  users.map(user => (
                    <UserSearchResult
                      key={user._id}
                      user={user}
                      onSelect={setSelectedUser}
                      selected={selectedUser?._id === user._id}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaRegFrown className="text-4xl mb-2" />
                    <p>No recent transactions / search a user</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-medium text-gray-800 mb-4">Enter Amount</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of coins
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400"
                    placeholder="Enter amount"
                    min="1"
                    max={balance}
                  />
                </div>
                <button
                  onClick={handleShare}
                  disabled={!selectedUser || !amount}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                    ${selectedUser && amount 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } transition-colors`}
                >
                  <IoSend className={selectedUser && amount ? 'text-white' : 'text-gray-400'} />
                  Share Coins
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Coins;