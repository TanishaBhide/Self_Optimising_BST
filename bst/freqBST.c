#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/* ===============================
   CONFIGURATION
   =============================== */
#define NAME_LEN 50
#define FREQ_THRESHOLD 3
#define DECAY_FACTOR 0.8

/* ===============================
   NODE DEFINITION
   =============================== */
struct Node {
    char name[NAME_LEN];
    int leftFreq;
    int rightFreq;
    struct Node *left;
    struct Node *right;
};

/* ===============================
   GLOBAL METRIC
   =============================== */
int nodeVisits = 0;

/* ===============================
   CREATE NODE
   =============================== */
struct Node* createNode(char name[]) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    strcpy(newNode->name, name);
    newNode->leftFreq = 0;
    newNode->rightFreq = 0;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

/* ===============================
   INSERT (STANDARD BST)
   =============================== */
struct Node* insert(struct Node* root, char name[]) {
    if (root == NULL)
        return createNode(name);

    if (strcmp(name, root->name) < 0)
        root->left = insert(root->left, name);
    else if (strcmp(name, root->name) > 0)
        root->right = insert(root->right, name);

    return root;
}

/* ===============================
   SEARCH WITH FREQUENCY TRACKING
   =============================== */
int search(struct Node* root, char key[]) {
    if (root == NULL)
        return 0;

    nodeVisits++;

    if (strcmp(key, root->name) == 0)
        return 1;

    if (strcmp(key, root->name) < 0) {
        root->leftFreq++;
        return search(root->left, key);
    } else {
        root->rightFreq++;
        return search(root->right, key);
    }
}

/* ===============================
   SELF-OPTIMIZATION
   =============================== */
void optimize(struct Node* root) {
    if (root == NULL)
        return;

    int diff = root->rightFreq - root->leftFreq;

    /* Swap subtrees if frequency difference is significant */
    if (abs(diff) >= FREQ_THRESHOLD && diff > 0) {
        struct Node* temp = root->left;
        root->left = root->right;
        root->right = temp;

        int tempFreq = root->leftFreq;
        root->leftFreq = root->rightFreq;
        root->rightFreq = tempFreq;
    }

    /* Apply decay */
    root->leftFreq = (int)(root->leftFreq * DECAY_FACTOR);
    root->rightFreq = (int)(root->rightFreq * DECAY_FACTOR);

    optimize(root->left);
    optimize(root->right);
}

/* ===============================
   INORDER DISPLAY
   =============================== */
void inorder(struct Node* root) {
    if (root == NULL)
        return;

    inorder(root->left);
    printf("%s (L:%d R:%d)\n",
           root->name, root->leftFreq, root->rightFreq);
    inorder(root->right);
}

/* ===============================
   MENU-DRIVEN MAIN
   =============================== */
int main() {
    struct Node* root = NULL;
    int choice;
    char name[NAME_LEN];

    while (1) {
        printf("\n--- FREQUENCY-AWARE CONTACT BST ---\n");
        printf("1. Insert Contact\n");
        printf("2. Search Contact\n");
        printf("3. Display Contacts (Inorder)\n");
        printf("4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
        case 1:
            printf("Enter contact name: ");
            scanf("%s", name);
            root = insert(root, name);
            printf("Contact inserted.\n");
            break;

        case 2:
            printf("Enter contact name to search: ");
            scanf("%s", name);
            nodeVisits = 0;

            if (search(root, name)) {
                printf("Contact FOUND.\n");
                optimize(root);
            } else {
                printf("Contact NOT FOUND.\n");
            }

            printf("Node visits: %d\n", nodeVisits);
            break;

        case 3:
            printf("\nContacts (Alphabetical Order):\n");
            inorder(root);
            break;

        case 4:
            printf("Exiting program.\n");
            exit(0);

        default:
            printf("Invalid choice.\n");
        }
    }

    return 0;
}
