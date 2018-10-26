# READ ME

### P2P Attendance DApp

### The Problem

Traditionally attendance is viewed as a function of self reporting. Since the early introduction of IoT, the Attendance system has evolved from Verification in Person to Identity Card Scan (QR to NFS), and then to Biometrics (Fingerprint Readers, Eye Scanners). However, in each of the above cases, the attendance is stored at a central server.

Each of the traditional cases of taking attendance is susceptible to manipulation at the server level. 

### The Solution

*P2P Attendance DApp* is a distributed consensus of ascertaining the presence of whether an attendee is present or not. We propose a solution, built on top of the Ethereum network, that uses smart contracts to enforce both anonymity and rewards. 

The attendance is both independently and universally verifiable and maintain all of the desirable properties of the blockchain (such as immutability). All of this is achieved without sacrificing privacy or integrity. The resulting system shows clear potential for Blockchain technology to become a central part of attendance systems for enterprises wishing to incorporate transparency and security.

### The Methodology

We propose a system through which attendance of a particular attendee is ascertained through a simple consensus. The photo of a random potential attendee **‘the attendee’** from the pool is shown to another attendee ‘the verifier’ at a specified time for a limited period of time, with three options of *‘Present, Absent, Skip’* in a Mobile App. This process is known as the **‘attendance flash’**. This allows the verifier to mark attendance for his/her peers between the three options. As a collusion prevention measure, the **‘attendance flash’** occurs at a period in time during which the peers would not be working together.

A simple consensus is taken after many such verifiers provide their options if a particular attendee was marked present (‘Present’), marked absent (‘Absent’) or they do not remember (‘Skip’). After the simple consensus, the verifiers are rewarded if the option they provided is in majority, else they are penalised. This incentivisation also makes a case for the default verification option to be assumed to be true.



### The Reward and Penalty Scheme

To start with **‘the verifiers’** are issued with a basic minimum number of tokens. While submitting their attendance opinions they can utilize a unit quantity of these tokens. Post the consensus, if ‘the verifier’ is on the majority side, he/she earns an attendance reward along with the original token, while his/her original token is forfeited if her/she is on the minority side of the consensus. At the end of an attendance period, the total reward tokens are recoinciled and remitted to the corresponding verifier.

### The Components

- **Truffle Smart Contracts** - This is a set of Smart Contracts with exposed APIs to enable the marking attendance and the corresponding user specific dispositions to the Ethereum Network.
- **Mobile App Client** - This is an mobile app client which will be used by the employees to mark the attendance of their peers.


