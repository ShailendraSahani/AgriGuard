// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Smart Contract jo AgriGuard ke liye data store karega
contract AgriGuard {
    // -----------------------------------------------------------------------
    // 1. STATE VARIABLES and DATA STRUCTURES
    // -----------------------------------------------------------------------

    // Har batch ko unique tarike se pehchanne ke liye
    uint256 public nextBatchId = 1;

    // Kisaan ka role (Sirf yeh address naye batches register kar sakta hai)
    address public immutable farmerRole; 

    // Batch ki history ke liye ek structure
    struct TrackingEvent {
        string status;             // Jaise: "Harvested", "In Transit", "Delivered"
        string details;            // Additional notes (e.g., "Temperature 25C")
        uint256 timestamp;         // Kab yeh event hua
        address actor;             // Kisne yeh event record kiya (Kisaan, Transporter, etc.)
    }

    // Main Product Batch Structure
    struct ProductBatch {
        uint256 batchId;
        address farmer;
        string farmLocationGPS;    // Khet ki location
        bool isActive;             // Kya batch abhi tracking mein hai?
        // Is batch se jude saare events ki list
        TrackingEvent[] history; 
    }

    // Saare batches ko store karne ke liye mapping (mapping: Key-Value storage)
    // Key: Batch ID (uint256), Value: ProductBatch struct
    mapping(uint256 => ProductBatch) public batches;


    // -----------------------------------------------------------------------
    // 2. CONSTRUCTOR and MODIFIERS
    // -----------------------------------------------------------------------
    
    // Constructor: Contract deploy karte waqt chalta hai
    constructor() {
        // Contract deploy karne wala address hi shuru mein farmerRole banega
        farmerRole = msg.sender; 
    }

    // Modifier: Ek zaroori check jo functions ke shuru mein lagaya jaata hai
    modifier onlyFarmer() {
        require(msg.sender == farmerRole, "Only the registered farmer can perform this action.");
        _; // Function ka code iske baad chalta hai
    }


    // -----------------------------------------------------------------------
    // 3. CORE FUNCTIONS (WRITE)
    // -----------------------------------------------------------------------

    // Naya batch record karne ka function
    function registerBatch(string memory _location) public onlyFarmer returns (uint256) {
        // Naya Batch ID lein
        uint256 batchId = nextBatchId;
        
        // Naye Batch ko initialize karein
        batches[batchId] = ProductBatch({
            batchId: batchId,
            farmer: msg.sender,
            farmLocationGPS: _location,
            isActive: true,
            history: new TrackingEvent[](0) // Shuru mein history khaali
        });

        // Initial event record karein
        _recordEvent(batchId, "Registered and Harvested", "Initial registration by farmer.", msg.sender);

        // Next batch ID ko badha dein
        nextBatchId++;
        
        return batchId;
    }

    // Batch ka status update karne ka function (sabse zaroori)
    function updateBatchStatus(
        uint256 _batchId, 
        string memory _status, 
        string memory _details
    ) public {
        // Zaroori checks
        require(batches[_batchId].farmer != address(0), "Batch does not exist."); // Batch maujood hai?
        require(batches[_batchId].isActive, "Batch tracking is closed.");        // Tracking band toh nahi?

        // Event record karein
        _recordEvent(_batchId, _status, _details, msg.sender);

        // Agar delivered ho gaya, toh tracking band kar dein
        if (keccak256(abi.encodePacked(_status)) == keccak256(abi.encodePacked("Delivered"))) {
            batches[_batchId].isActive = false;
        }
    }

    // -----------------------------------------------------------------------
    // 4. HELPER FUNCTION
    // -----------------------------------------------------------------------
    
    // Event ko history array mein add karne ka private function
    function _recordEvent(
        uint256 _batchId, 
        string memory _status, 
        string memory _details, 
        address _actor
    ) private {
        // Naya event banayein
        TrackingEvent memory newEvent = TrackingEvent({
            status: _status,
            details: _details,
            timestamp: block.timestamp,
            actor: _actor
        });

        // History array mein daal dein
        batches[_batchId].history.push(newEvent);
        
        // Product ka current status update karein
        batches[_batchId].currentStatus = _status; // Note: CurrentStatus field abhi struct mein nahi hai, agar daalna ho toh add kar sakte hain.
    }
}