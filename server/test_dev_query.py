#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_model import process_user_query

def test_dev_query():
    """Test the development query that was failing"""
    
    # Test the specific failing query
    query = "code for the backend development"
    user_id = 1  # HR user
    
    print(f"Testing query: '{query}' for user ID {user_id}")
    print("=" * 50)
    
    result = process_user_query(user_id, query)
    
    print("Result:")
    for key, value in result.items():
        print(f"  {key}: {value}")
    
    # Check if it's now classified as appropriate
    if result.get("is_appropriate", False):
        print("\n✅ SUCCESS: Query is now classified as corporate/appropriate!")
    else:
        print(f"\n❌ STILL FAILING: Query classified as {result.get('label', 'unknown')}")
    
    print("=" * 50)

if __name__ == "__main__":
    test_dev_query()
