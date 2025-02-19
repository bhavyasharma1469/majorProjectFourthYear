#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <string>
using namespace std;

class TreeNode {
public:
    string name;
    bool isLocked;
    int id;
    TreeNode* parent;
    int ancestorsLocked;
    int descendantsLocked;
    vector<TreeNode*> children;

    TreeNode(const string& name, TreeNode* parent = nullptr)
        : name(name), isLocked(false), id(0), parent(parent),
          ancestorsLocked(0), descendantsLocked(0) {}
};

class LockingTree {
    unordered_map<string, TreeNode*> nodeMap;
    TreeNode* root;

public:
    LockingTree(const vector<string>& nodes, int m) {
        buildTree(nodes, m);
    }

    bool processQuery(int operation, const string& nodeName, int userId) {
        if (nodeMap.find(nodeName) == nodeMap.end()) return false;
        TreeNode* node = nodeMap[nodeName];

        if (operation == 1) return lockNode(node, userId);
        if (operation == 2) return unlockNode(node, userId);
        if (operation == 3) return upgradeNode(node, userId);

        return false;
    }

private:
    void buildTree(const vector<string>& nodes, int m) {
        root = new TreeNode(nodes[0]);
        nodeMap[nodes[0]] = root;

        queue<TreeNode*> nodeQueue;
        nodeQueue.push(root);

        int index = 1, n = nodes.size();
        while (!nodeQueue.empty() && index < n) {
            TreeNode* current = nodeQueue.front();
            nodeQueue.pop();

            for (int i = 0; i < m && index < n; ++i) {
                TreeNode* child = new TreeNode(nodes[index], current);
                current->children.push_back(child);
                nodeMap[nodes[index]] = child;
                nodeQueue.push(child);
                ++index;
            }
        }
    }

    bool lockNode(TreeNode* node, int userId) {
        if (node->isLocked || node->ancestorsLocked > 0 || node->descendantsLocked > 0) 
            return false;

        updateAncestorLockCount(node, 1);
        updateDescendantLockStatus(node, 1);
        node->isLocked = true;
        node->id = userId;

        return true;
    }

    bool unlockNode(TreeNode* node, int userId) {
        if (!node->isLocked || node->id != userId)
            return false;

        updateAncestorLockCount(node, -1);
        updateDescendantLockStatus(node, -1);
        node->isLocked = false;
        node->id = 0;

        return true;
    }

    bool upgradeNode(TreeNode* node, int userId) {
        if (node->isLocked || node->ancestorsLocked > 0 || node->descendantsLocked == 0)
            return false;

        vector<TreeNode*> lockedDescendants;
        if (!gatherLockedDescendants(node, lockedDescendants, userId))
            return false;

        for (TreeNode* descendant : lockedDescendants)
            unlockNode(descendant, userId);

        lockNode(node, userId);
        return true;
    }

    void updateAncestorLockCount(TreeNode* node, int delta) {
        TreeNode* current = node->parent;
        while (current) {
            current->descendantsLocked += delta;
            current = current->parent;
        }
    }

    void updateDescendantLockStatus(TreeNode* node, int delta) {
        if (!node) return;
        node->ancestorsLocked += delta;
        for (TreeNode* child : node->children) {
            updateDescendantLockStatus(child, delta);
        }
    }

    bool gatherLockedDescendants(TreeNode* node, vector<TreeNode*>& lockedDescendants, int userId) {
        if (!node) return true;

        if (node->isLocked) {
            if (node->id != userId) return false;
            lockedDescendants.push_back(node);
        }

        for (TreeNode* child : node->children) {
            if (!gatherLockedDescendants(child, lockedDescendants, userId))
                return false;
        }

        return true;
    }
};

int main() {
    int n, m, q;
    cin >> n >> m >> q;

    vector<string> nodes(n);
    for (int i = 0; i < n; ++i) {
        cin >> nodes[i];
    }

    vector<tuple<int, string, int>> queries(q);
    for (int i = 0; i < q; ++i) {
        int operation;
        string nodeName;
        int userId;
        cin >> operation >> nodeName >> userId;
        queries[i] = {operation, nodeName, userId};
    }

    LockingTree tree(nodes, m);

    for (const auto& query : queries) {
        int operation;
        string nodeName;
        int userId;
        tie(operation, nodeName, userId) = query;

        cout << tree.processQuery(operation, nodeName, userId) << endl;
    }

    return 0;
}
