// #include <iostream>
// #include <cmath>
// #include <cstdlib>
// #include <algorithm>

// using namespace std;

// int main() {
//     int t;
//     cin >> t;

//     while (t--) {
//         double x;
//         int y;
//         cin >> x >> y;
//         int count = 0;

//         if (y != 0 && y % 2 == 0) {
//             if (x - y / 2 * 7 > 0) {
//                 x = x - y / 2 * 7;
//                 count = y / 2 + ceil(x / 15);
//             } else {
//                 count = y / 2;
//             }
//         } else if (y % 2 != 0) {
//             if (x - (y / 2) * 7 - 11 > 0) {
//                 count = y / 2 + 1 + ceil((x - (y / 2) * 7 - 11) / 15);
//             } else {
//                 count = y / 2 + 1;
//             }
//         } else {
//             count = ceil(x / 15);
//         }
        
//         cout << count << endl;
//     }    
// }
#include <iostream>
#include <iomanip>
#include <cmath>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <utility>
#include <string>
#include <unordered_map>
#include <unordered_set>

using namespace std;

#define MOD (int)1000000007
#define all(a) a.begin(),a.end()
#define for0(i, n) for (int i = 0; i < n; i++)
#define for1(i, n) for (int i = 1; i <= n; i++)
#define loop(i,a,b) for (int i = a; i < b; i++)
#define rarr(i,a,b) for(int i=a;i>b;i--)
#define forrev(i,n) for(int i=n-1;i>=0;i--)
#define tc(t) int t; cin >> t; while (t--)
#define int long long 
#define ll long long
#define prec(n) fixed<<setprecision(n)
#define pii pair<int, int>
#define vi vector<int>
#define vl vector<ll>
#define vpl vector<pair<ll, ll>>
#define vb vector<bool>
#define vs vector<string>
#define vpi vector<pair<int, int>>
#define pll pair<ll, ll>
#define mii map<int,int>
#define msi map<string,int>
#define sint set<int>
#define sstr set<string>
#define pb(x) push_back(x)
#define ss second
#define ff first
#define mp(a,b) make_pair(a,b)
#define endl '\n'
#define Yes cout<<"Yes"<<"\n";
#define No  cout<<"No"<<"\n";
#define YES cout<<"YES"<<"\n";
#define NO  cout<<"NO"<<"\n";
#define ina(arr,n) int arr[n]; for0(i,n){cin>>arr[i];} 
#define inva(arr,n) vector<int> arr(n); for0(i,n){cin>>arr[i];}
#define in(x) int x;cin>>x;
#define in2(x,y) int x,y;cin>>x>>y;
#define in3(x,y,z) int x,y,z;cin>>x>>y>>z;
#define in4(x,y,z,a) cin>>x>>y>>z>>a;
#define transform(sl) transform(sl.begin(), sl.end(), sl.begin(), ::tolower);

int gcd(int a, int b) { if (a == 0) return b; return gcd(b % a, a); }
int lcm(int a, int b) { return (a * b) / gcd(a, b); }
int power(int a, int n) { int res = 1; while (n) { if(n & 1) res = (res * a) % MOD; n >>= 1; a = (a * a) % MOD; } return res; }
int minv(int a) { return power(a, MOD - 2); }
int mod(int n) { return (n % MOD + MOD) % MOD; }
int modM(int n, int m) { return ((ll)(n % MOD) * (m % MOD)) % MOD; }
int modA(int n, int m) { return ((ll)(n % MOD) + (m % MOD)) % MOD; }
int modS(int n, int m) { return (((ll)(n % MOD) - (m % MOD)) + MOD) % MOD; }
int modD(int n, int m) { return ((ll)(n % MOD) * (minv(m) % MOD)) % MOD; }
int max(int a, int b) { if (a > b) return a; else return b; }
int min(int a, int b) { if (a < b) return a; else return b; } 
bool isPowerOfTwo(int x) { return x && (!(x & (x - 1))); }
bool isPrime(int N) { if(N <= 1) return false; for(int i = 2; i * i <= N; ++i) { if(N % i == 0) return false; } return true; }
void solve() {}

int32_t main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    // solve();
    int a[13] = {10, 10, 8, 9, 8, 7, 7, 7, 7, 0, 9, 6, 8};
    ll n;
    cin >> n;
    cout << a[n];
}

